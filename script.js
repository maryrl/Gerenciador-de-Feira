        let people = 2;
        let weeks = 4;
        let products = [];

        // Produtos pré-definidos para exemplo
        const defaultProducts = [
            { name: 'Arroz', baseQuantity: 0.5, unit: 'kg', pricePerUnit: 6.50 },
            { name: 'Feijão', baseQuantity: 0.25, unit: 'kg', pricePerUnit: 8.90 },
            { name: 'Banana', baseQuantity: 1, unit: 'kg', pricePerUnit: 4.20 },
            { name: 'Tomate', baseQuantity: 0.5, unit: 'kg', pricePerUnit: 7.80 },
            { name: 'Leite', baseQuantity: 1, unit: 'L', pricePerUnit: 5.50 },
            { name: 'Ovos', baseQuantity: 0.5, unit: 'dúzia', pricePerUnit: 12.00 }
        ];

        function adjustPeople(change) {
            people = Math.max(1, people + change);
            document.getElementById('peopleCount').textContent = people;
            updateSummary();
            renderProducts();
        }

        function adjustWeeks(change) {
            weeks = Math.max(1, Math.min(8, weeks + change));
            document.getElementById('weeksCount').textContent = weeks;
            updateSummary();
            renderProducts();
        }

        function addProduct() {
            const name = document.getElementById('productName').value.trim();
            const baseQuantity = parseFloat(document.getElementById('baseQuantity').value);
            const unit = document.getElementById('unit').value;
            const pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value);

            if (!name || !baseQuantity || baseQuantity <= 0) {
                alert('Por favor, preencha o nome e quantidade corretamente!');
                return;
            }

            const product = {
                id: Date.now(),
                name: name,
                baseQuantity: baseQuantity,
                unit: unit,
                pricePerUnit: pricePerUnit || 0
            };

            products.push(product);
            
            // Limpar campos
            document.getElementById('productName').value = '';
            document.getElementById('baseQuantity').value = '';
            document.getElementById('pricePerUnit').value = '';
            
            renderProducts();
            updateSummary();
        }

        function removeProduct(id) {
            products = products.filter(p => p.id !== id);
            renderProducts();
            updateSummary();
        }

        function calculateQuantity(baseQuantity) {
            const total = baseQuantity * people * weeks;
            return total % 1 === 0 ? total.toString() : total.toFixed(1);
        }

        function renderProducts() {
            const productList = document.getElementById('productList');
            const emptyState = document.getElementById('emptyState');

            if (products.length === 0) {
                productList.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            productList.innerHTML = products.map(product => {
                const totalQuantity = calculateQuantity(product.baseQuantity);
                const totalPrice = product.pricePerUnit ? (parseFloat(totalQuantity) * product.pricePerUnit).toFixed(2) : null;
                const priceDisplay = product.pricePerUnit ? `R$ ${product.pricePerUnit.toFixed(2)}/${product.unit}` : 'Sem preço';
                
                return `
                    <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4 fade-in">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800">${product.name}</h3>
                            <p class="text-sm text-gray-600">
                                ${product.baseQuantity} ${product.unit} por pessoa/semana
                            </p>
                            <p class="text-xs text-blue-600">${priceDisplay}</p>
                        </div>
                        <div class="text-right mr-4">
                            <div class="text-lg font-bold text-green-600">${totalQuantity} ${product.unit}</div>
                            <div class="text-xs text-gray-500">Total necessário</div>
                            ${totalPrice ? `<div class="text-sm font-semibold text-blue-600 mt-1">R$ ${totalPrice}</div>` : ''}
                        </div>
                        <button onclick="removeProduct(${product.id})" class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full font-bold transition-colors">×</button>
                    </div>
                `;
            }).join('');
        }

        function updateSummary() {
            const summary = document.getElementById('summary');
            const totalItems = document.getElementById('totalItems');
            const summaryPeople = document.getElementById('summaryPeople');
            const summaryWeeks = document.getElementById('summaryWeeks');

            if (products.length > 0) {
                summary.classList.remove('hidden');
                totalItems.textContent = products.length;
                summaryPeople.textContent = people;
                summaryWeeks.textContent = weeks;
                
                // Calcular valor total
                const totalCost = products.reduce((sum, product) => {
                    if (product.pricePerUnit) {
                        const totalQuantity = parseFloat(calculateQuantity(product.baseQuantity));
                        return sum + (totalQuantity * product.pricePerUnit);
                    }
                    return sum;
                }, 0);
                
                const totalCostElement = document.getElementById('totalCost');
                if (totalCostElement) {
                    totalCostElement.textContent = totalCost.toFixed(2);
                }
            } else {
                summary.classList.add('hidden');
            }
        }

        function clearList() {
            if (products.length === 0) return;
            
            if (confirm('Tem certeza que deseja limpar toda a lista?')) {
                products = [];
                renderProducts();
                updateSummary();
            }
        }

        // Inicializar com produtos de exemplo
        function initializeWithDefaults() {
            products = defaultProducts.map(product => ({
                ...product,
                id: Date.now() + Math.random()
            }));
            renderProducts();
            updateSummary();
        }

        // Inicializar a aplicação
        initializeWithDefaults();
